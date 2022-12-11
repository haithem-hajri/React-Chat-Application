import React from "react";
import ImageUploading from "react-images-uploading";
import { RiChatDeleteFill } from "react-icons/ri";
import { FcEditImage } from "react-icons/fc";
import "./Upload.scss";
const UploadImage = (props) => {
  const { imageError, setImages, images, setImageError } = props;
  const maxNumber = 1;
  // const [image, setImage] = React.useState<any>();

  const onChangeImage = (imageList, addUpdateIndex) => {
    // data for submit
    setImages(imageList);
    setImageError(false);
  };
  return (
    <div>
      <div>
        <ImageUploading
          multiple={false}
          value={images}
          onChange={onChangeImage}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageUpdate,
            isDragging,
            dragProps,
            onImageRemove,
          }) => (
            // write your building UI
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column-reverse",
              }}
            >
              <button
                className={images?"hidden-button": "display-button"}
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Upload
              </button>

              {images && images.length > 0 ? (
                imageList.map((image, index) => (
                  <div key={index}>
                    <img className="image" alt="xl" src={image["data_url"]} />
                    <div
                      spacing={2}
                      direction={"row"}
                      pt={5}
                      align={"center"}
                      justify="center"
                    >
                      <FcEditImage
                        onClick={() => onImageUpdate(index)}
                        fontSize={"2rem"}
                        cursor={"pointer"}
                        color="black"
                        _hover={{ color: "pink.300" }}
                      />

                      <RiChatDeleteFill
                        onClick={() => {
                          onImageRemove(index);
                          setImages(null);
                        }}
                        fontSize={"2rem"}
                        cursor={"pointer"}
                        color="#50A5DC"
                        _hover={{ color: "pink.300" }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <img
                  className="image"
                  alt="xl"
                  src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                />
              )}
            </div>
          )}
        </ImageUploading>
        <span style={{color:"red"}}>{imageError && " please add an image "}</span>
      </div>
    </div>
  );
};

export default UploadImage;
