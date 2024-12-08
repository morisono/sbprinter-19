import { format } from 'date-fns';

export type PrinterType = 'zebra' | 'dymo';

export const generateZplForLabel = (alignerNum: number, totalAligners: string, date: Date) => {
  return `^XA
^CF0,60
^FO50,50^FD${format(date, "MMM d")}^FS
^CF0,45
^FO50,120^FD${format(date, "yyyy")}^FS
^CF0,45
^FO50,190^FD${alignerNum} of ${totalAligners}^FS
^XZ`;
};

export const generateDymoXml = (alignerNum: number, totalAligners: string, date: Date) => {
  return `<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="twips">
  <PaperOrientation>Portrait</PaperOrientation>
  <Id>Small30334</Id>
  <PaperName>30334 1 in x 1 in</PaperName>
  <DrawCommands>
    <RoundRectangle X="0" Y="0" Width="1440" Height="1440" Rx="180" Ry="180" />
  </DrawCommands>
  <ObjectInfo>
    <TextObject>
      <Name>Date</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
      <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>False</IsVariable>
      <HorizontalAlignment>Center</HorizontalAlignment>
      <VerticalAlignment>Middle</VerticalAlignment>
      <TextFitMode>ShrinkToFit</TextFitMode>
      <UseFullFontHeight>True</UseFullFontHeight>
      <Verticalized>False</Verticalized>
      <StyledText>
        <Element>
          <String>${format(date, "MMM d")}\n${format(date, "yyyy")}\n${alignerNum} of ${totalAligners}</String>
          <Attributes>
            <Font Family="Arial" Size="12" Bold="True" Italic="False" Underline="False" Strikeout="False" />
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
          </Attributes>
        </Element>
      </StyledText>
    </TextObject>
  </ObjectInfo>
</DieCutLabel>`;
};