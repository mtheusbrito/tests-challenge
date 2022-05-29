import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "shared/errors/AppError";
import { CreateUserError } from "./CreateUserError";

import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
describe("Create user",()=>{
  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })
  it("should be able to create a new User", async()=>{
    const user = await createUserUseCase.execute({name: "User", email: "user@gmail.com", password: "admin"});

    expect(user).toHaveProperty("id");
  })

  it("should not be able to create a new User with exists email", async () => {
    expect(async()=>{
      await createUserUseCase.execute({
        name: "User",
        email: "user@gmail.com",
        password: "admin",
      });

      await createUserUseCase.execute({
        name: "User",
        email: "user@gmail.com",
        password: "admin",
      });


    }).rejects.toBeInstanceOf(CreateUserError)
  });
})
