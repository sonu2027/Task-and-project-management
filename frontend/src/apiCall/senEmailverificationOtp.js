async function sendEmailVerificationCode(email) {
  const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  console.log("Generated code: ", code);

  const data = {
    code,
    email,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URI}/api/auth/sendemailverificationcode`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    console.log("response: ", response);

    if (response.ok) {
      return code;
    }
  } catch (error) {
    return error;
  }
}

export default sendEmailVerificationCode;
