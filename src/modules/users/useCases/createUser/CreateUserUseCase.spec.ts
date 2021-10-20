import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {

    const userCreated = await createUserUseCase.execute({
      email: "natan@fin.com",
      name: "Natan",
      password: "natan123",
    });

    expect(userCreated).toHaveProperty("id");
  });

  it("Should not be able to create a new user", async () => {

    expect(async () => {
      await createUserUseCase.execute({
        email: "natan@fin.com",
        name: "Natan",
        password: "natan123",
      });

      await createUserUseCase.execute({
        email: "natan@fin.com",
        name: "Ataide",
        password: "ataide123",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
