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
        credentials: "include", 
      }
    );

    const result = await response.json();

    if (result.userExist) {
      return { userExist: true };
    }

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
