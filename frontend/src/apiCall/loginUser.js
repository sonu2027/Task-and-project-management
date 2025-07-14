const loginUser = async (credentials) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URI}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      }
    );
    const result = await response.json();

    if (!response.ok) throw new Error("Login failed");

    return { token: result.token };
  } catch (error) {
    console.error("Login error:", error);
    return { error: true };
  }
};

export default loginUser;
