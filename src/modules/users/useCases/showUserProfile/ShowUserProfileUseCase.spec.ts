import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show the user profile", async () => {

    const user = await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "Test",
      password: "1234",
    });

    const search = await showUserProfileUseCase.execute(user.id as string);

    expect(search).toBe(user);
  });

  it("Should not be able to show the profile of a non-existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non-existent id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
