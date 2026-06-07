import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

function Welcome() {
  return (
    <>
      <Navbar />

      <section className="bg-red-50 min-h-screen flex justify-center items-center">

        <div className="text-center">

          <h1 className="text-6xl font-bold text-red-600">
            AI Predictive Blood Crisis Precaution System
          </h1>

          <p className="mt-5 text-xl">
            Predicting Blood Needs Before Emergencies Happen
          </p>

          <button className="mt-8 bg-red-600 text-white px-8 py-3 rounded-lg">
            Get Started
          </button>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Welcome;