import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ItineraryEntry,
  setActivityColumn,
  setDate,
  setItinerary,
  updateActivityItinerary,
  updateTimeItinerary,
} from "@/redux/itinerarySlice";
import { RootState } from "@/redux/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import saveAs from "file-saver";
import * as XLSX from "xlsx";
const ItineraryPlanner = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const dispatch = useDispatch();
  const { date, activityColumn, itinerary } = useSelector(
    (state: RootState) => state.itinerary,
  );
  const columnNoSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && +value <= 10) {
      dispatch(setActivityColumn(+value));
    }
  };

  const generateTable = () => {
    if (!date.from || !date.to) return;

    const dates: ItineraryEntry[] = [];
    const currentDate = new Date(date.from);

    const end = new Date(date.to);
    while (currentDate <= end) {
      dates.push({
        date: currentDate.toLocaleDateString(),
        activity: [],
        time: [],
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    dispatch(setItinerary(dates));
  };
  const handleSave = () => {
    // Save JSON file
    const jsonBlob = new Blob([JSON.stringify(itinerary)], {
      type: "application/json",
    });
    saveAs(jsonBlob, "itinerary.json");

    // Save Excel file
    const worksheet = XLSX.utils.json_to_sheet(itinerary);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Itinerary");
    const excelBlob = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBlob], { type: "application/octet-stream" }),
      "itinerary.xlsx",
    );
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = JSON.parse(e.target?.result as string);
        dispatch(setItinerary(content));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={cn("grid gap-2 text-black", className)}>
      <div className="flex gap-2 items-end">
        <div className="grid max-w-sm items-center gap-1.5">
          <Label htmlFor="dateRange" className=" text-white">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(new Date(date.from), "dd LLL, y")} -{" "}
                      {format(new Date(date.to), "dd LLL, y")}
                    </>
                  ) : (
                    format(new Date(date.from), "dd LLL, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                id="dateRange"
                initialFocus
                mode="range"
                defaultMonth={date?.from ? new Date(date.from) : undefined}
                selected={{
                  from: date?.from ? new Date(date.from) : undefined,
                  to: date?.to ? new Date(date.to) : undefined,
                }}
                onSelect={(dateSelected) => {
                  dispatch(
                    setDate({
                      from: dateSelected?.from
                        ? format(dateSelected.from.toISOString(), "dd LLL, y")
                        : null,
                      to: dateSelected?.to
                        ? format(dateSelected.to.toISOString(), "dd LLL, y")
                        : null,
                    }),
                  );
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid max-w-sm items-center justify-items-center gap-1.5">
          <Label htmlFor="colNo" className="text-white">
            Column Number (max 10 columns)
          </Label>
          <Input
            type="string"
            id="colNo"
            value={activityColumn}
            onChange={columnNoSet}
          />
        </div>
        <Button
          disabled={!(date.from && date.to && activityColumn !== 0)}
          className="hover:bg-slate-400 hover:text-black disabled:bg-gray-400 bg-blue-900"
          onClick={generateTable}
        >
          Generate Table
        </Button>
        <div className="grid gap-1.5">
          <Label htmlFor="loadBtn" className="text-white">
            Load from JSON file
          </Label>
          <Input type="file" accept=".json" onChange={handleFileUpload} />
        </div>
      </div>
      <div className="h-[70vh] relative overflow-auto">
        {itinerary.length > 0 && (
          <Table className="bg-white rounded-md pb-9 h-full">
            <TableHeader className="sticky top-0 bg-blue-900 ">
              <TableRow className="hover:bg-blue-900">
                <TableHead className="w-5 text-white">Date</TableHead>
                <TableHead
                  colSpan={activityColumn}
                  className="text-center text-white"
                >
                  Activity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itinerary.map((date, index) => (
                <TableRow>
                  <TableCell>{date.date}</TableCell>
                  {activityColumn !== 0 &&
                    [...Array(activityColumn)].map((_, colIndex) => (
                      <TableCell>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            onChange={(e) =>
                              dispatch(
                                updateTimeItinerary({
                                  index,
                                  colIndex,
                                  time: e.target.value,
                                }),
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="desc">Activities</Label>
                          <Input
                            id="desc"
                            onChange={(e) =>
                              dispatch(
                                updateActivityItinerary({
                                  index,
                                  colIndex,
                                  activity: e.target.value,
                                }),
                              )
                            }
                          />
                        </div>
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div>
        <Button
          className="bg-slate-50 text-black font-bold hover:bg-slate-900 hover:text-white float-right"
          onClick={handleSave}
        >
          Save Itinerary
        </Button>
      </div>
    </div>
  );
};

export default ItineraryPlanner;
