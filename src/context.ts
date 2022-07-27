
import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma";

export interface Context {
    prisma: PrismaClient
}

export const getContext = async (req: Request): Promise<Context> => {
    return {
        prisma: new PrismaClient()
    }
}