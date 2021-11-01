import React from "react";

interface ErrorProps {
  errorMessage: string;
}

const ErrorPage: React.FC<ErrorProps> = (props) => {
  return <>An Error occured: {props.errorMessage}</>;
};

export default ErrorPage;
