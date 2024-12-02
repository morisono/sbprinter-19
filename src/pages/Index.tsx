import { useState } from "react";
import { PasswordProtection } from "@/components/PasswordProtection";
import { LabelForm } from "@/components/LabelForm";
import { CSSTransition } from "react-transition-group";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <CSSTransition
        in={!isAuthenticated}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <PasswordProtection onAuthenticated={() => setIsAuthenticated(true)} />
      </CSSTransition>

      <CSSTransition
        in={isAuthenticated}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <LabelForm />
      </CSSTransition>
    </div>
  );
};

export default Index;