import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {useAppSelector} from "@/app/redux/hook";

const CardCollapse = ({
                        children,
                        title,
                        isShowHeader=true
                      }: { children: React.ReactNode, title: string, isShowHeader?: boolean }) => {
  const [expanded, setExpanded] = useState<boolean>(true)
  const screenSize = useAppSelector(state => state.screen_size)

  useEffect(() => {
    if(!isShowHeader && screenSize === 'desktop') {
      setExpanded(true)
    }
  }, [screenSize]);

  return (
    <Card className="mb-4" style={{boxShadow: '0px 4px 4px 0px #A6AFC366'}}>
      {
        isShowHeader &&
        <CardHeader className="bg-[#F4EEFF]">
          <CardTitle>{title}</CardTitle>
          <CardAction className="cursor-pointer">
            {
              expanded
                ? <FontAwesomeIcon icon={faChevronDown} onClick={() => setExpanded(false)}/>
                : <FontAwesomeIcon icon={faChevronUp} onClick={() => setExpanded(true)}/>
            }
          </CardAction>
        </CardHeader>
      }

      {
        expanded &&  <CardContent className="p-3 relative">{children}</CardContent>
      }
    </Card>
  )
}

export default CardCollapse;
