import { Link, createFileRoute } from "@tanstack/react-router";
import { Button, Stack, Box } from "@mui/material";
import axios from "axios";
import { DefectHeader, DefectButtonRecord, Defects } from "../Domain";
import {
  useState,
  useMemo,
  useRef,
  useEffect,
  HTMLAttributes,
  MouseEvent,
} from "react";
import Select, { FocusHandle } from "../components/Select";
import Grid from "@mui/material/Unstable_Grid2";

export const Route = createFileRoute("/defect/$defectId")({
  loader: ({ context: { queryClient }, params: { defectId } }) =>
    queryClient.ensureQueryData({
      queryKey: ["terminal", { defectId }],
      queryFn: () => fetchDefect(defectId),
    }),
  component: DefectPage,
});

const fetchDefect = async (defectId: string) => {
  try {
    const header = axios
      .get<DefectHeader>(`https://api.sunucu.com/defect/header/${defectId}`)
      .then((data) => data.data);
    const screen = axios
      .get<Defects>(`https://api.sunucu.com/defect/screen/${defectId}`)
      .then((data) => data.data);
    return Promise.all([header, screen]).then((values) => ({
      defectHeader: values[0],
      defectScreen: values[1],
    }));
  } catch (e) {
    throw new Error("Error");
  }
};

const InfoBox = ({
  title,
  value,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title: string;
  value: string;
}) => (
  <div
    className="flex flex-col border border-solid border-black px-1"
    {...props}
  >
    <div className="whitespace-nowrap text-center">{title}</div>
    <div className="mx-auto">{value}</div>
  </div>
);

type Props = {
  onClick: (e: MouseEvent<HTMLDivElement>, box: DefectButtonRecord) => void;
  box: DefectButtonRecord;
};

type DefectOptions = {
  value: string;
  label: string;
};

const DefectBox = ({ box, onClick }: Props) => {
  const style = {
    left: box.boxX,
    top: box.boxY,
    width: box.boxWidth,
    height: box.boxHeight,
    fontSize: 12,
    borderColor: box.boxColor,
  };

  return (
    <div
      className={`border-4 absolute pr-3 cursor-pointer`}
      style={style}
      onClick={(e) => {
        onClick(e, box);
      }}
    >
      <div className="bg-white">{box.labelText}</div>
    </div>
  );
};

enum State {
  selectBox,
  selectDefectType,
  enterLocation,
  waitingSubmit,
}

function DefectPage() {
  const { defectHeader, defectScreen } = Route.useLoaderData();
  const [insert, setInsert] = useState<State>(State.selectBox);
  const selectRef = useRef<FocusHandle>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [pointerPosition, setPointerPosition] = useState<{
    top: number | string;
    left: number | string;
  }>({ top: "50%", left: "50%" });
  const [form, setForm] = useState({
    defectType: "",
  });

  const buttonClick = (e: MouseEvent, box: DefectButtonRecord) => {
    if (box.boxColor !== "blue") {
      setInsert(State.selectDefectType);
      setMenuPosition({
        top: box.boxY + box.boxHeight,
        left: box.boxX,
      });
    }
  };

  const onImageClick = (e: MouseEvent) => {
    if (is(State.enterLocation)) {
      console.log("clicked image");
      if (imgRef.current) {
        setPointerPosition({
          top: e.clientY - imgRef.current.getBoundingClientRect().top,
          left: e.clientX - imgRef.current.getBoundingClientRect().left,
        });
      }
      setInsert(State.enterLocation);
    }
  };

  const is = (states: State[] | State) => {
    if (Array.isArray(states)) return states.includes(insert);
    else return insert == states;
  };

  const submitDefect = () => {
    alert(
      JSON.stringify({
        positionX: pointerPosition.left,
        positionY: pointerPosition.top,
        defectType: form.defectType,
      })
    );
    setInsert(State.selectBox);
  };

  // TODO Test if useMemo is really required here!
  const options = useMemo(
    () =>
      defectScreen.partDefects.map<DefectOptions>((defect) => ({
        value: defect.defectName,
        label: defect.defectName,
      })),
    [defectScreen]
  );

  useEffect(() => {
    switch (insert) {
      case State.selectDefectType:
        selectRef.current?.focus();
    }
  }, [insert]);

  return (
    <>
      <Grid container spacing={1} maxWidth={1296} mx={"auto"}>
        <Grid xs={1}>
          <InfoBox title="Montaj No" value={String(defectHeader.seqNo)} />
        </Grid>
        <Grid xs={1}>
          <InfoBox title="Body No" value={String(defectHeader.bodyNo)} />
        </Grid>
        <Grid xs={5} alignItems={"start"}>
          <h1 className=" align-top"> Hata Giriş Ekranı</h1>
        </Grid>
        <Grid xs={1} xsOffset={2}>
          <InfoBox
            title="Renk"
            style={{
              backgroundColor: defectHeader.bgColor,
              fontWeight: "bold",
              color: "white",
            }}
            value={defectHeader.extCode}
          />
        </Grid>
        <Grid xs={2}>
          <h2 className="max-w-full text-center">
            {defectHeader.firstname + " " + defectHeader.lastname}
          </h2>
        </Grid>
        <Grid xs={10} maxWidth={1000}>
          <div className="relative">
            <img
              ref={imgRef}
              className="w-max"
              src={`/src/mocks/${defectScreen.terminalPictureId}.jpg`}
              onClick={onImageClick}
            />
            {is(State.enterLocation) && (
              <img
                src="/src/pointer.png"
                style={{
                  position: "absolute",
                  top: pointerPosition.top,
                  left: pointerPosition.left,
                  width: 43,
                  height: 64,
                }}
              />
            )}
            {!is(State.enterLocation) &&
              defectScreen.defectButtonRecords.map((box, id) => (
                <Link
                  key={id}
                  to="/defect/$defectId"
                  params={{ defectId: "123" }}
                  disabled={!(box.boxColor == "blue")}
                >
                  <DefectBox box={box} onClick={(e) => buttonClick(e, box)} />
                </Link>
              ))}
            {insert == State.selectDefectType && (
              <Select
                menuIsOpen={true}
                ref={selectRef}
                closeMenuOnSelect={false}
                options={options}
                className="w-[300px]"
                style={{
                  position: "absolute",
                  top: menuPosition.top,
                  left: menuPosition.left,
                }}
                onChange={(n, m) => {
                  setInsert(State.enterLocation);
                  setForm({ defectType: (n as DefectOptions).value });
                  console.log("selected: ", (n as DefectOptions).value);
                }}
                onClickOutside={() => {
                  setInsert(State.selectBox);
                }}
              />
            )}
          </div>
        </Grid>
        <Grid xs={2}>
          <Stack justifyContent={"space-between"} height={"100vh"}>
            <Stack spacing={3}>
              <Button variant="outlined" disabled>
                HIZLI KAYDET
              </Button>
              <Button variant="outlined" disabled>
                KAYDET VE GEÇ
              </Button>
              <Button
                variant="outlined"
                disabled={!(insert == State.enterLocation)}
                onClick={submitDefect}
              >
                HATA KAYIT
              </Button>
            </Stack>
            <Stack spacing={3}>
              <Button variant="outlined">ARA</Button>
              <Button variant="outlined">TERMİNAL İLK RESMİ</Button>
              <Button variant="outlined">SIK GELEN HATA</Button>
              <Button variant="outlined">MANİFEST</Button>
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={10}>
          <Stack
            direction={"row"}
            spacing={1}
            className="max-w-full"
            alignItems={"stretch"}
          >
            <Box sx={{ flexGrow: 1, width: 0 }}>
              <Link to="/terminals">
                <Button variant="outlined" fullWidth>ÇIKIŞ</Button>
              </Link>
            </Box>
            <Button variant="outlined" sx={{ flexGrow: 1, width: 0 }}>
              MODEL İLK RESMİ
            </Button>
            <Button variant="outlined" sx={{ flexGrow: 1, width: 0 }}>
              GERİ
            </Button>
            <Button variant="outlined" sx={{ flexGrow: 1, width: 0 }}>
              HATA LİSTESİ
            </Button>
            <Button variant="outlined" sx={{ flexGrow: 1, width: 0 }}>
              TEMİZLE
            </Button>
            <Button variant="outlined" sx={{ flexGrow: 1, width: 0 }}>
                BÜYÜK FONT
            </Button>
          </Stack>
        </Grid>
        <Grid xs={2}>
          {is([State.waitingSubmit, State.enterLocation]) && (
            <h2 className="font-bold text-center max-w-full text-red-600">
              {form.defectType}
            </h2>
          )}
        </Grid>
      </Grid>
    </>
  );
}
