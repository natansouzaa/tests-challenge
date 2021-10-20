import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get statement operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it("Should be able to get a statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test",
      email: "test@fin.com",
      password: "12345",
    });

    const statement = await inMemoryStatementsRepository.create({
      amount: 100,
      description: "Test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string,
    });

    expect(statementOperation).toBe(statement);
  });

  it("Should not be able to a the statement operation with a invalid id", async () => {
    expect(async () => {
      const statement = await inMemoryStatementsRepository.create({
        amount: 100,
        description: "Test",
        type: OperationType.DEPOSIT,
        user_id: "non-existent",
      });

      await getStatementOperationUseCase.execute({
        statement_id: statement.id as string,
        user_id: "non-existent",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get a non-existent statement operation", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Test",
        email: "test@fin.com",
        password: "12345",
      });

      await getStatementOperationUseCase.execute({
        statement_id: "non-existent",
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
