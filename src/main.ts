import { PostStatusInterceptor } from './core/interceptors/post-status.interceptor';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from './core/filters/error.filter';
import { CustomValidationPipe } from './core/pipes/custom-validation.pipe';
import { useContainer } from 'class-validator';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: false,
      validationError: { target: true },
      skipMissingProperties: true,
      skipNullProperties: true,
      skipUndefinedProperties: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalInterceptors(new PostStatusInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ErrorFilter(httpAdapter));

  // Register Swagger (Fastify) - enabled only in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const fastifyInstance = app.getHttpAdapter().getInstance();

    await fastifyInstance.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Logam Mulia API',
          description: 'API documentation',
          version: '1.0.0',
        },
      },
      exposeRoute: true,
    });

    await fastifyInstance.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      uiConfig: { docExpansion: 'list' },
      staticCSP: true,
      swagger: {
        url: '/documentation/json'
      }
    });
  }

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
