/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { OrderModule } from './orders/order.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import typeOrmConfig from "./config/typeorm";
import { CloudinaryModule } from './cloudinary/clodinary.module';
import { StripeModule } from './stripe/stripe.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get("typeorm");
        if(!config) throw new Error("TypeORM config not found.")

        return config
      }
    }),
    CategoriesModule,
    ProductsModule, 
    UsersModule, 
    OrderModule,
    AuthModule,
    CloudinaryModule,
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: "1h"
      },
      secret: process.env.JWT_SECRET
    }),
    StripeModule.forRootAsync()
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/")
  }
}

