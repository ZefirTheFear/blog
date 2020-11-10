import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import cloneDeep from "clone-deep";

import { FaImage, FaTrashAlt } from "react-icons/fa";
import { CgArrowsVAlt } from "react-icons/cg";
import { IoMdText } from "react-icons/io";

import ContentRichTextEditor from "../ContentRichTextEditor/ContentRichTextEditor";
import ContentImage from "../ContentImage/ContentImage";
import InvalidFeedback from "../InvalidFeedback/InvalidFeedback";

import {
  ContentUnitToSend,
  ContentUnitTypes,
  IImageContentUnitToSend
} from "../../models/ContentUnit";

import "./ContentMaker.scss";

interface IContentMakerProps {
  sendContentToParent: (data: ContentUnitToSend[]) => void;
  loadedData?: ContentUnitToSend[];
  errors?: string[];
}

interface IAddingOptions {
  type: string;
  title: string;
  icon: JSX.Element;
  onClick: () => void;
}

const ContentMaker: React.FC<IContentMakerProps> = ({
  sendContentToParent,
  loadedData,
  errors
}) => {
  const imgInput = useRef<HTMLInputElement>(null!);

  const [contentData, setContentData] = useState<ContentUnitToSend[]>([]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination || destination.index === source.index) {
        return;
      }

      const newContentData = cloneDeep(contentData);
      const draggableItem = newContentData.find((item) => item.id === draggableId);
      if (draggableItem) {
        newContentData.splice(source.index, 1);
        newContentData.splice(destination.index, 0, draggableItem);
        setContentData(newContentData);
      }
    },
    [contentData]
  );

  const addTextBlock = useCallback(() => {
    setContentData((prevContentData) => [
      ...prevContentData,
      { id: uuid(), type: ContentUnitTypes.text, content: "" }
    ]);
  }, []);

  const onChangeTextBlockData = useCallback((content: string, index: number) => {
    setContentData((prevState) => {
      const newContentData = cloneDeep(prevState);
      newContentData[index].content = content;
      return newContentData;
    });
  }, []);

  const clickImgInput = useCallback(() => {
    imgInput.current.click();
  }, []);

  const addImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newImages: IImageContentUnitToSend[] = [];
    const images = e.target.files;
    if (images) {
      for (let i = 0; i < images.length; i++) {
        newImages.push({
          type: ContentUnitTypes.image,
          content: images[i],
          url: URL.createObjectURL(images[i]),
          id: uuid()
        });
      }
    }
    setContentData((prevContentData) => [...prevContentData, ...newImages]);
    e.target.value = "";
  }, []);

  const removeContentItem = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      const newContentData = cloneDeep(contentData).filter(
        (item) => item.id !== e.currentTarget.getAttribute("data-item-id")
      );
      setContentData(newContentData);
    },
    [contentData]
  );

  const addingOptions = useMemo<IAddingOptions[]>(() => {
    return [
      {
        type: "text",
        title: "text",
        icon: <IoMdText />,
        onClick: addTextBlock
      },
      {
        type: "img",
        title: "image",
        icon: <FaImage />,
        onClick: clickImgInput
      }
    ];
  }, [addTextBlock, clickImgInput]);

  useEffect(() => {
    if (loadedData) {
      setContentData(loadedData);
    }
  }, [loadedData]);

  useEffect(() => {
    sendContentToParent(contentData);
  }, [contentData, sendContentToParent]);

  return (
    <div className="content-maker">
      <div
        className={
          "content-maker__constructor" + (errors ? " content-maker__constructor_invalid" : "")
        }
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="column-1">
            {(provided, snapshot) => (
              <div
                className={
                  "content-maker__content" +
                  (snapshot.isDraggingOver ? " content-maker__content_is-dragging-over" : "") +
                  (contentData.length === 0 ? " content-maker__content_empty" : "")
                }
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {contentData.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={
                          "content-maker__content-item" +
                          (snapshot.isDragging ? " content-maker__content-item_isdragging" : "")
                        }
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <span
                          className="content-maker__content-item-dragger"
                          {...provided.dragHandleProps}
                        >
                          <CgArrowsVAlt />
                        </span>
                        {item.type === ContentUnitTypes.text ? (
                          <ContentRichTextEditor
                            content={item.content}
                            index={index}
                            onChangeTextBlockData={onChangeTextBlockData}
                            isDragging={snapshot.isDragging}
                          />
                        ) : (
                          <ContentImage url={item.url} isDragging={snapshot.isDragging} />
                        )}
                        <span
                          className="content-maker__content-item-remove"
                          data-item-id={item.id}
                          onClick={removeContentItem}
                        >
                          <FaTrashAlt />
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="content-maker__options">
            {addingOptions.map((item) => (
              <div className="content-maker__options-item" key={item.type}>
                <div className="content-maker__options-icon" onClick={item.onClick}>
                  {item.icon}
                </div>
                <label>{item.title}</label>
              </div>
            ))}
          </div>
          <input
            type="file"
            className="content-maker__img-input"
            multiple
            accept="image/*"
            onChange={addImage}
            ref={imgInput}
          />
        </DragDropContext>
      </div>
      {errors && errors.map((msg) => <InvalidFeedback key={msg} msg={msg} />)}
    </div>
  );
};

export default ContentMaker;
