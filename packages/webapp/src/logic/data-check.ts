import { Injectable, type OnModuleInit } from '@nestjs/common';
import { PrismaService } from './services/prisma';
import { problemGenerators } from 'problem-generator';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class DataCheck implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {}

  private async checkGeneratorIntegrity(): Promise<void> {
    const prisma = this.moduleRef.get(PrismaService);
    const dbGenerators = await prisma.problemGenerator.findMany();
    const dbNames = new Set(dbGenerators.map((g) => g.name));
    const libNames = new Set(Object.keys(problemGenerators));
    const allNames = new Set([...dbNames, ...libNames]);

    console.log('Checking problem generators:');
    for (const gen of allNames) {
      const ok = dbNames.has(gen) && libNames.has(gen);

      const icon = ok ? '❎' : '❌';
      console.log(`${icon} ${gen}`);
    }
  }

  // TODO: There's a false positive here in which I haven't exported all generators from
  //       the problem-generator module, therefore all are ❎, but I actually forgot to export some.
  async onModuleInit(): Promise<void> {
    await this.checkGeneratorIntegrity();
  }
}
