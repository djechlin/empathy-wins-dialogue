import { ReactNode } from 'react';

interface FactCardListProps {
  children: ReactNode;
}

const FactCardList = ({ children }: FactCardListProps) => {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {children}
    </ul>
  );
};

export default FactCardList;