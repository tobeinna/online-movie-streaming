import { Link } from "react-router-dom"
import MainButton from "../../components/Buttons/MainButton/MainButton"

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center">
        <div className="container w-fit h-fit mx-auto my-auto">
            <h1 className="w-min mx-auto mb-6 text-5xl text-slate-300 font-bold">Oops...</h1>
            <p className="text-white text-center mx-4 font-semibold text-xl">Seems like the page you're looking for does not exist.</p>
            <div className="button-container mt-8">
                <Link to={"/"}>
                <MainButton type="outlined" text="Back to Homepage" />
                </Link>
            </div>
        </div>
    </div>
  )
}

export default NotFound