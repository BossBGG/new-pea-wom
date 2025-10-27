import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface EventDetailItemProps {
  icon: IconDefinition;
  label: string;
  value: string;
}

const EventDetailItem: React.FC<EventDetailItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center">
      <FontAwesomeIcon icon={icon} className="text-[#671FAB] w-4 mr-3" />
      <div className="text-[14px]">
        <div className="text-[#57595B]">{label}</div>
        <div className="text-[#160C26]">{value}</div>
      </div>
    </div>
  );
};

export default EventDetailItem;
