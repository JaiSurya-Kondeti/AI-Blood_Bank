function Login() {
  return (
    <div className="min-h-screen flex justify-center items-center">

      <div className="bg-white shadow-lg p-8 rounded-lg w-96">

        <h2 className="text-3xl font-bold mb-5 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-3 mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-3 mb-3"
        />

        <select className="border w-full p-3 mb-3">

          <option>Patient</option>
          <option>Donor</option>
          <option>Blood Bank</option>
          <option>Admin</option>

        </select>

        <button className="bg-red-600 text-white w-full p-3 rounded">
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;