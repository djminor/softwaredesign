// AI-assisted: see AI-ATTRIBUTION.md
const bcrypt = require("bcryptjs");
const { DynamoDaoFactory } = require("../dist/model/dao/dynamo/DynamoDaoFactory");

const MALE_IMAGE_URL =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
const FEMALE_IMAGE_URL =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png";

const USERS = [
  { firstName: "Allen", lastName: "Anderson", alias: "@allen", imageUrl: MALE_IMAGE_URL },
  { firstName: "Amy", lastName: "Ames", alias: "@amy", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Bob", lastName: "Bobson", alias: "@bob", imageUrl: MALE_IMAGE_URL },
  { firstName: "Bonnie", lastName: "Beatty", alias: "@bonnie", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Chris", lastName: "Colston", alias: "@chris", imageUrl: MALE_IMAGE_URL },
  { firstName: "Cindy", lastName: "Coats", alias: "@cindy", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Dan", lastName: "Donaldson", alias: "@dan", imageUrl: MALE_IMAGE_URL },
  { firstName: "Dee", lastName: "Dempsey", alias: "@dee", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Elliott", lastName: "Enderson", alias: "@elliott", imageUrl: MALE_IMAGE_URL },
  { firstName: "Elizabeth", lastName: "Engle", alias: "@elizabeth", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Frank", lastName: "Frandson", alias: "@frank", imageUrl: MALE_IMAGE_URL },
  { firstName: "Fran", lastName: "Franklin", alias: "@fran", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Gary", lastName: "Gilbert", alias: "@gary", imageUrl: MALE_IMAGE_URL },
  { firstName: "Giovanna", lastName: "Giles", alias: "@giovanna", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Henry", lastName: "Henderson", alias: "@henry", imageUrl: MALE_IMAGE_URL },
  { firstName: "Helen", lastName: "Hopwell", alias: "@helen", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Igor", lastName: "Isaacson", alias: "@igor", MALE_IMAGE_URL },
  { firstName: "Isabel", lastName: "Isaacson", alias: "@isabel", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Justin", lastName: "Jones", alias: "@justin", MALE_IMAGE_URL },
  { firstName: "Jill", lastName: "Johnson", alias: "@jill", imageUrl: FEMALE_IMAGE_URL },
  { firstName: "Kent", lastName: "Knudson", alias: "@kent", MALE_IMAGE_URL },
  { firstName: "Kathy", lastName: "Kunzler", alias: "@kathy", imageUrl: FEMALE_IMAGE_URL },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function seed() {
  const factory = new DynamoDaoFactory();
  const userDao = factory.getUserDao();
  const followDao = factory.getFollowDao();
  const storyDao = factory.getStoryDao();
  const feedDao = factory.getFeedDao();

  const passwordHash = await bcrypt.hash("password", 10);
  const allen = USERS[0];
  const circle = USERS.slice(1, 13); // 12 users: @amy through @fran

  console.log("Seeding 22 users (password: 'password')...");
  for (let i = 0; i < USERS.length; i++) {
    const u = USERS[i];
    const isAllen = u.alias === "@allen";
    const inCircle = i >= 1 && i <= 12;
    await userDao.putUser({
      alias: u.alias,
      firstName: u.firstName,
      lastName: u.lastName,
      passwordHash,
      imageUrl: u.imageUrl,
      followerCount: isAllen ? 12 : inCircle ? 1 : 0,
      followeeCount: isAllen ? 12 : inCircle ? 1 : 0,
    });
    await sleep(50);
  }

  console.log("Seeding 12 followees and 12 followers for @allen...");
  for (const other of circle) {
    // @allen follows other
    await followDao.putFollow({
      follower_handle: allen.alias,
      followee_handle: other.alias,
      follower_name: `${allen.firstName} ${allen.lastName}`,
      followee_name: `${other.firstName} ${other.lastName}`,
    });
    await sleep(50);

    // other follows @allen
    await followDao.putFollow({
      follower_handle: other.alias,
      followee_handle: allen.alias,
      follower_name: `${other.firstName} ${other.lastName}`,
      followee_name: `${allen.firstName} ${allen.lastName}`,
    });
    await sleep(50);
  }

  const now = Date.now();

  console.log("Seeding 12 story items for @allen...");
  for (let i = 1; i <= 12; i++) {
    const timestamp = now - (13 - i) * 60_000;
    const post = `Allen story post #${i}: Hello @amy! Check out https://byu.edu`;
    await storyDao.putStoryItem({
      sender_alias: allen.alias,
      timestamp,
      post,
      statusDto: {
        post,
        user: allen,
        timestamp,
      },
    });
    await sleep(50);
  }

  console.log("Seeding 12 feed items for @allen (and stories for each author)...");
  for (let i = 0; i < circle.length; i++) {
    const author = circle[i];
    const timestamp = now - (12 - i) * 90_000;
    const post = `Post #${i + 1} from ${author.firstName} (${author.alias}): Hi @allen, check out https://cs.byu.edu`;
    const record = {
      sender_alias: author.alias,
      timestamp,
      post,
      statusDto: {
        post,
        user: author,
        timestamp,
      },
    };
    await storyDao.putStoryItem(record);
    await sleep(50);
    await feedDao.putFeedItem(allen.alias, record);
    await sleep(50);
  }

  console.log("Seeding complete!");
  console.log("Test account -> alias: @allen, password: password");
  console.log("Seeded for @allen: 12 followers, 12 followees, 12 story items, 12 feed items.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
