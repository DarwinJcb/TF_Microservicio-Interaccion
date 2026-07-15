/* tf_microservicio-interacciones/src/prisma/prisma.service.ts */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { obtenerVariableEntorno } from '../configuracion/entorno';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const databaseUrl = obtenerVariableEntorno('DATABASE_URL');
        const adapter = new PrismaPg({
            connectionString: databaseUrl,
        });

        super({
            adapter,
        });
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }
}