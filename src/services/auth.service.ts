import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../configs/prisma";
import { generateToken } from "../utils/generateToken";

export const registerService = async (data: {
  email: string;
  password: string;
  name: string;
  username: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new Error("Email already exists");
    }
    if (existingUser.username === data.username) {
      throw new Error("Username already exists");
    }
  }

  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });

  return user;
};

export const loginService = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user.id);

  return { user, token };
};

export const getMeService = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, username: true },
  });
};
