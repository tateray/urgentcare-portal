
import React from 'react';
import DetailedFacilityCard from './facilities/DetailedFacilityCard';
import CompactFacilityCard from './facilities/CompactFacilityCard';
import SpecialistList from './facilities/SpecialistList';
import { Facility } from './facilities/types';

interface HospitalListProps {
  facilities: Facility[];
  onDirections: (facility: Facility) => void;
  onCall: (phone: string) => void;
  onSelect?: (facility: Facility) => void;
  view?: 'compact' | 'detailed' | 'specialist';
}

const HospitalList: React.FC<HospitalListProps> = ({ 
  facilities, 
  onDirections, 
  onCall,
  onSelect,
  view = 'detailed'
}) => {
  if (view === 'specialist' && onSelect) {
    return <SpecialistList facilities={facilities} onSelect={onSelect} />;
  }

  return (
    <div className="space-y-4">
      {facilities.map((facility) => {
        if (view === 'detailed') {
          return (
            <DetailedFacilityCard 
              key={facility.id}
              facility={facility}
              onDirections={onDirections}
              onCall={onCall}
            />
          );
        } else {
          return (
            <CompactFacilityCard 
              key={facility.id}
              facility={facility}
              onDirections={onDirections}
              onCall={onCall}
            />
          );
        }
      })}
    </div>
  );
};

export default HospitalList;
