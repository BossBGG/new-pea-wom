import {NewsItem} from "@/types";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-solid-svg-icons";
import {Button} from "@/components/ui/button";
import {formatDateNewsRange} from "@/app/helpers/DatetimeHelper";
import WOMLogo from "@/assets/images/logo_wom.png"

const NewsDialogContent = ({news} : {news: NewsItem}) => {
  return (
    <DialogContent className="h-[90%] max-w-[80%] lg:max-w-[50%] flex flex-col justify-between">
      <div className="overflow-x-hidden h-[90%]">
        <DialogHeader className="border-b-4 border-b-[#D0BAE5] pb-2">
          <DialogTitle className="text-[24px]">{news.title}</DialogTitle>
          <DialogDescription>
            {news.description}
          </DialogDescription>
          {
            (news.publishDateStart || news.publishDateEnd) &&
            <div>
              <FontAwesomeIcon icon={faClock} size="sm" color="#57595B" className="mr-2"/>
              <span className="text-[14px] text-[#57595B]">{formatDateNewsRange(news.publishDateStart, news.publishDateEnd)}</span>
            </div>
          }
        </DialogHeader>

        <div className="my-3">
          <div className="w-[50%] h-[241px] flex justify-self-center rounded-[12px] border-[1px] mb-8">
            <img className="object-cover rounded-[12px] w-full h-full"
                 alt="annoucement cover image"
                 src={news.coverImageFile?.url || WOMLogo.src}/>
          </div>
          <div dangerouslySetInnerHTML={{__html: news.content}}></div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button className="pea-button" variant="outline">ปิด</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export { NewsDialogContent }
