import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance of user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
  });

  it("Should be able to get a balance", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@fin.com",
      name: "Test",
      password: "12345",
    });

    const statementDeposit = await inMemoryStatementsRepository.create({
      amount: 105,
      description: "Test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const statementWithdraw = await inMemoryStatementsRepository.create({
      amount: 100,
      description: "Test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toStrictEqual({
      statement: [statementDeposit, statementWithdraw],
      balance: 5,
    });
  });

  it("Should not be able to get a balance of a non-existent user", async () => {
    expect(async () => {
      await inMemoryStatementsRepository.create({
        amount: 100,
        description: "Test",
        type: OperationType.DEPOSIT,
        user_id: "non-existent",
      });

      await getBalanceUseCase.execute({
        user_id: "non-existent",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
