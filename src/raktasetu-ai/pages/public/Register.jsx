import { useState } from "react";

function Register() {

  const [role, setRole] = useState("");

  return (
    <div className="min-h-screen flex justify-center items-center">

      <div className="bg-white shadow-lg p-8 rounded-lg w-[500px]">

        <h2 className="text-3xl font-bold mb-5">
          Register
        </h2>

        <select
          className="border w-full p-3 mb-3"
          onChange={(e) => setRole(e.target.value)}
        >

          <option>Select Role</option>
          <option value="patient">Patient</option>
          <option value="donor">Donor</option>
          <option value="bloodbank">Blood Bank</option>

        </select>

        <input
          placeholder="Full Name"
          className="border w-full p-3 mb-3"
        />

        <input
          placeholder="Email"
          className="border w-full p-3 mb-3"
        />

        <input
          placeholder="Phone"
          className="border w-full p-3 mb-3"
        />

        <input
          placeholder="Password"
          type="password"
          className="border w-full p-3 mb-3"
        />

        <button className="bg-red-600 text-white w-full p-3 rounded">
          Register
        </button>

      </div>

    </div>
  );
}

export default Register;