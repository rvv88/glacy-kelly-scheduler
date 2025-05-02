
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted py-6">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Consultório Odontológico Dra. Glacy Kelly Bisaggio. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
