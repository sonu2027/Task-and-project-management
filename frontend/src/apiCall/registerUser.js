const registerUser = async (userData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URI}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include", // if you're using cookies or sessions
      }
    );

    const result = await response.json();

    // ⛔ User already exists
    if (result.userExist) {
      return { userExist: true };
    }

    // ✅ Successful registration
    return {
      userExist: false,
      token: result.data?.token,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: true };
  }
};

export default registerUser;
