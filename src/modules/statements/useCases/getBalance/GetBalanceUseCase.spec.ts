import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { StatementsRepository } from "@modules/statements/repositories/StatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get a Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );

    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  });
  it("should be able to get a balance", async () => {
    const user = await createUserUseCase.execute({
      name: "User",
      email: "user@gmail.com",
      password: "admin",
    });
    const user_id = user.id as string;
    await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      description: "Statement test",
      amount: 900,
    });

    await createStatementUseCase.execute({
       user_id,
       type: OperationType.WITHDRAW,
       description: "Statement test",
       amount: 100,
     });
     const balance = await getBalanceUseCase.execute({user_id})
    expect(balance).toHaveProperty("statement");
  });
});
