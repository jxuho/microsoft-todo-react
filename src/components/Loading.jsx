import { Oval } from "react-loader-spinner";


const Loading = () => {


  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
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
