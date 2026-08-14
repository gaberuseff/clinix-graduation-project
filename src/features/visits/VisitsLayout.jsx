import PageHeader from "@/components/ownUI/PageHeader";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {
  Stethoscope,
  Search,
  X,
  CalendarDays,
  History,
  ClipboardList,
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TodayAppointmentsTable from "./TodayAppointmentsTable";
import TodayVisitsTable from "./TodayVisitsTable";
import PatientHistoryTimeline from "./PatientHistoryTimeline";
import CreateVisitDrawer from "./CreateVisitDrawer";
import {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {useQueryClient, useIsFetching} from "@tanstack/react-query";
import {RiRefreshLine} from "@remixicon/react";

function VisitsLayout() {
  const {t} = useAppTranslation("visits");
  const [searchParams, setSearchParams] = useSearchParams();

  const [phoneSearch, setPhoneSearch] = useState(
    searchParams.get("phone") || searchParams.get("search") || "",
  );
  const [activeTab, setActiveTab] = useState(
    searchParams.get("phone") ? "history" : "today",
  );

  const queryClient = useQueryClient();

  const isFetchingTodayAppointments = useIsFetching({ queryKey: ["today-appointments"] }) > 0;
  const isFetchingTodayVisits = useIsFetching({ queryKey: ["today-visits"] }) > 0;
  const isFetchingHistory = useIsFetching({ queryKey: ["medical_records"] }) > 0 || useIsFetching({ queryKey: ["patient-info"] }) > 0;

  const isFetching =
    activeTab === "today"
      ? isFetchingTodayAppointments
      : activeTab === "completed"
        ? isFetchingTodayVisits
        : activeTab === "history"
          ? isFetchingHistory
          : false;

  const handleRefetch = () => {
    if (activeTab === "today") {
      queryClient.invalidateQueries({ queryKey: ["today-appointments"] });
    } else if (activeTab === "completed") {
      queryClient.invalidateQueries({ queryKey: ["today-visits"] });
    } else if (activeTab === "history") {
      queryClient.invalidateQueries({ queryKey: ["medical_records"] });
      queryClient.invalidateQueries({ queryKey: ["patient-info"] });
    }
  };

  useEffect(() => {
    const urlPhone = searchParams.get("phone") || searchParams.get("search");
    if (urlPhone) {
      setPhoneSearch(urlPhone);
      setActiveTab("history");
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanSearch = String(phoneSearch || "").trim();
    if (cleanSearch) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("phone", cleanSearch);
      setSearchParams(nextParams);
      setActiveTab("history");
    }
  };

  const handleClearSearch = () => {
    setPhoneSearch("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("phone");
    nextParams.delete("search");
    setSearchParams(nextParams);
    setActiveTab("today");
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 space-y-5">
      {/* Header & Primary Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <PageHeader
          icon={Stethoscope}
          title={t("title")}
          description={t("subtitle")}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Top Search Bar by Phone */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full sm:w-[320px]">
            <Search className="absolute start-3 size-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder={t("searchPlaceholder")}
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              className="ps-9 pe-9 text-xs h-10 rounded-xl bg-card border-border/60"
            />
            {phoneSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute end-3 text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </form>

          {/* Refetch Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefetch}
            disabled={isFetching || (activeTab === "history" && String(phoneSearch || "").trim().length <= 2)}
            className="shrink-0"
            title={t("refreshTooltip")}>
            <RiRefreshLine
              className={`size-4 text-muted-foreground ${
                isFetching ? "animate-spin text-primary" : ""
              }`}
            />
          </Button>

          {/* Create Visit Button */}
          <CreateVisitDrawer showTrigger={true} />
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="today"
              className="flex items-center gap-2 text-xs font-semibold rounded-lg">
              <CalendarDays className="size-3.5" />
              <span>{t("tabs.todayAppointments")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex items-center gap-2 text-xs font-semibold rounded-lg">
              <ClipboardList className="size-3.5" />
              <span>كشوفات اليوم</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 text-xs font-semibold rounded-lg">
              <History className="size-3.5" />
              <span>{t("tabs.patientHistory")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Today's Appointments Table */}
        <TabsContent value="today" className="space-y-4 m-0">
          <TodayAppointmentsTable />
        </TabsContent>

        {/* Tab 2: Today's Completed Visits Table */}
        <TabsContent value="completed" className="space-y-4 m-0">
          <TodayVisitsTable />
        </TabsContent>

        {/* Tab 3: Patient EMR History Timeline */}
        <TabsContent value="history" className="space-y-4 m-0">
          <PatientHistoryTimeline phone={phoneSearch} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default VisitsLayout;
