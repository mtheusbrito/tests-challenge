import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { StatementsRepository } from "@modules/statements/repositories/StatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";



let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);

    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository,statementsRepository)

    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );

    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });
  it("should be able to get a statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "User",
      email: "user@gmail.com",
      password: "admin",
    });
    const user_id = user.id as string;
    await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      description: "Statement deposit test",
      amount: 900,
    });

    const statement = await createStatementUseCase.execute({
      user_id,
      type: OperationType.WITHDRAW,
      description: "Statement withdraw test",
      amount: 100,
    });
    const balance = await getBalanceUseCase.execute({ user_id });

    const statement_id = statement.id as string;
    const statementOperation = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });
    console.log(statementOperation);
    expect(statementOperation).toHaveProperty("id");
  });
});
