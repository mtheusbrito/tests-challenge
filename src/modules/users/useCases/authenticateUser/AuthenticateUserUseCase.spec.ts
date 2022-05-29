import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
describe("Authenticate user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase= new CreateUserUseCase(usersRepository);
  });
  it("should be able to authentication a User", async () => {

    const user = await createUserUseCase.execute({
       name: "User",
       email: "user@gmail.com",
       password: "admin",
     });

    const auth = await authenticateUserUseCase.execute({
      email: user.email,
      password: "admin",
    });

    expect(auth).toHaveProperty("token");
  });

  it("should not be able to authentication a User with email incorrect or not exists", async () => {
   expect(async()=>{
      await createUserUseCase.execute({
       name: "User",
       email: "user@gmail.com",
       password: "admin",
     });

      await authenticateUserUseCase.execute({
       email: "emailerror@gmail.com",
       password: "admin",
     });
   }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);


  });


  it("should not be able to authentication a User with password is incorrect", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User",
        email: "user@gmail.com",
        password: "admin",
      });

      await authenticateUserUseCase.execute({
        email: "user@gmail.com",
        password: "admissssn",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
