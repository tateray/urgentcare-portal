
import React from 'react';
import SpecialistCard from './SpecialistCard';
import { Facility } from './types';

interface SpecialistListProps {
  facilities: Facility[];
  onSelect: (facility: Facility) => void;
}

const SpecialistList: React.FC<SpecialistListProps> = ({ 
  facilities, 
  onSelect 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Choose Your Specialist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((facility) => (
          <SpecialistCard 
            key={facility.id}
            facility={facility}
            onClick={() => onSelect(facility)}
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialistList;
