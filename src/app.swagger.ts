import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SRD_MODULES } from '@gen/shared/shared.module';
import { GEN_MODULES } from '@gen/general.module';

const config = [
  { name: 'General', url: 'docs/general', version: `1.0.0`, modules: GEN_MODULES },
  { name: 'Shared', url: 'docs/shared', version: `1.0.0`, modules: SRD_MODULES },
];

export const initSwagger = (app: INestApplication) => {
  const principalOptions = new DocumentBuilder()
    .setTitle('Proyecto Base')
    .setVersion('1.0.0')
    .build();
  const principalDocument = SwaggerModule.createDocument(app, principalOptions);
  const swaggerOptionsUrls: { name: string; url: string }[] = [];
  config.forEach(el => {
    swaggerOptionsUrls.push({ name: el.name, url: `${el.url}/swagger.json` });
  });
  SwaggerModule.setup('docs', app, principalDocument, {
    explorer: true,
    swaggerOptions: { urls: swaggerOptionsUrls },
    jsonDocumentUrl: `/docs/swagger.json`,
  });

  config.forEach(el => {
    const documentBuilder = new DocumentBuilder()
      .setTitle(`Proyecto Base (${el.name})`)
      .setVersion(el.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, documentBuilder, { include: el.modules });
    SwaggerModule.setup(el.url, app, document, {
      explorer: true,
      jsonDocumentUrl: `${el.url}/swagger.json`,
    });
  });
};
