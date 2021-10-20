import { hash } from "bcryptjs";
import { userInfo } from "os";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate an user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test",
      email: "test@fin.com",
      password: await hash("12345", 8),
    });

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: "12345",
    });

    expect(authenticatedUser).toHaveProperty("token");
  });

  it("should not be able to authenticate an user with a wrong password", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "Test",
        email: "test@fin.com",
        password: await hash("12345", 8),
      });

      await authenticateUserUseCase.execute({
        email: "test@fin.com",
        password: "wrong-password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a wrong email", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "Test",
        email: "test@fin.com",
        password: await hash("12345", 8),
      });

      const response = await authenticateUserUseCase.execute({
        email: "wrong-email@fin.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
