import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });
  it("should be able to show a User Profile", async () => {
    const user = await createUserUseCase.execute({
      name: "User",
      email: "user@gmail.com",
      password: "admin",
    });

    const  id  = user.id as string;
    const profile = await showUserProfileUseCase.execute(id);

    expect(profile).toHaveProperty("id");
  });

  it("should not be able to show a User Profile if not exists", async () => {
   expect(async () => {
     await createUserUseCase.execute({
       name: "User",
       email: "user@gmail.com",
       password: "admin",
     });

     const id = "asdfasdfasdf";
     await showUserProfileUseCase.execute(id);
   }).rejects.toBeInstanceOf(ShowUserProfileError);
  });


});
