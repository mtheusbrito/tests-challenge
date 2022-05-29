import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { StatementsRepository } from "@modules/statements/repositories/StatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";




let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository
describe("Create a statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);

    createStatementUseCase = new CreateStatementUseCase( usersRepository, statementsRepository);
  });
  it("should be able to create a new Statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User",
      email: "user@gmail.com",
      password: "admin",
    });
    const user_id  = user.id as string;
    const statement = await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      description: "Statement test",
      amount: 900
    });


    expect(statement).toHaveProperty("id");
  });


});
