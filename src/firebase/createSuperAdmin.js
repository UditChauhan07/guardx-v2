const { auth, database } = require("./Firebase");
const { createUserWithEmailAndPassword } = require("firebase/auth");
const { ref, set } = require("firebase/database");

const createSuperAdmin = async () => {
  const email = "superadmin@gmail.com";
  const password = "superadmin123";

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    await set(ref(database, `users/${userId}`), {
      role: "super_admin",
      email,
      password,
    });

    console.log("Super Admin created successfully!");
  } catch (error) {
    console.error("Error creating Super Admin:", error.message);
  }
};

createSuperAdmin();
