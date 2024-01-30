import { Oval } from "react-loader-spinner";


const Loading = () => {

  // const htmlElement = document.querySelector("html");
  // console.log(htmlElement.getAttribute('data-theme'));

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center">
      <Oval
        height={50}
        width={50}
        color="#2564cf"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#78bafd"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default Loading;
