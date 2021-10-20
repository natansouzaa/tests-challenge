import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create a new Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to create a deposit statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test",
      email: "test@fin.com",
      password: "12345",
    });

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: "Test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should be able to create a withdraw statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test",
      email: "test@fin.com",
      password: "12345",
    });

    await createStatementUseCase.execute({
      amount: 105,
      description: "Test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: "Test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to create a withdraw statement without funds", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Test",
        email: "test@fin.com",
        password: "12345",
      });

      await createStatementUseCase.execute({
        amount: 100,
        description: "Test",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should not be able to create a statement with a non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 100,
        description: "Test",
        type: OperationType.WITHDRAW,
        user_id: "non-existent",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
