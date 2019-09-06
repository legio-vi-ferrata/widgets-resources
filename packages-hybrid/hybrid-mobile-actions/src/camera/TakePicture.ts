// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

type PictureSource = "camera" | "imageLibrary";

type PictureQuality = "original" | "low" | "medium" | "high" | "custom";

/**
 * @param {MxObject} picture - This field is required.
 * @param {"HybridMobileActions.PictureSource.camera"|"HybridMobileActions.PictureSource.imageLibrary"} pictureSource - Select a picture from the library or the camera.
 * @param {"HybridMobileActions.PictureQuality.original"|"HybridMobileActions.PictureQuality.low"|"HybridMobileActions.PictureQuality.medium"|"HybridMobileActions.PictureQuality.high"|"HybridMobileActions.PictureQuality.custom"} pictureQuality - Set to empty to use default value 'medium'.
 * @param {Big} maximumWidth - The picture will be scaled to this maximum pixel width, while maintaing the aspect ratio.
 * @param {Big} maximumHeight - The picture will be scaled to this maximum pixel height, while maintaing the aspect ratio.
 * @returns {boolean}
 */

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
function TakePicture(
    picture?: mendix.lib.MxObject,
    pictureSource?: PictureSource,
    pictureQuality?: PictureQuality,
    maximumWidth?: BigJs.Big,
    maximumHeight?: BigJs.Big
): Promise<boolean> {
    // BEGIN USER CODE
    // Documentation https://github.com/apache/cordova-plugin-camera
    if (!picture) {
        throw new Error("Input parameter 'Picture' is required");
    }

    if (!picture.inheritsFrom("System.FileDocument")) {
        const entity = picture.getEntity();
        throw new Error(`Entity ${entity} does not inherit from 'System.FileDocument'`);
    }

    if (pictureQuality === "custom" && !maximumHeight && !maximumWidth) {
        throw new Error("Picture quality is set to 'Custom', but no maximum width or height was provided");
    }

    if (!navigator.camera) {
        throw new Error("TakePicture action requires cordova-plugin-camera to be installed in the app");
    }

    return takePicture()
        .then(uri =>
            getBlob(uri)
                .then(blob => saveDocument(picture, uri, blob))
                .then(result => {
                    navigator.camera.cleanup(
                        () => {
                            /* */
                        },
                        () => {
                            /* */
                        }
                    );
                    return result;
                })
        )
        .catch((error: string) => {
            if (error === "cancelled") {
                return false;
            }
            throw new Error(error);
        });

    function takePicture(): Promise<string> {
        return new Promise((resolve, reject) => {
            navigator.camera.getPicture(
                imageData => resolve(imageData),
                error => {
                    const message = error ? error.trim().toLowerCase() : "unknown";
                    const cancellation = message.includes("no image selected") || message.includes("camera cancelled");
                    reject(cancellation ? "cancelled" : message);
                },
                getOptions()
            );
        });
    }

    function getBlob(uri: string): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const onSuccess = (fileEntry: any): void =>
                fileEntry.file((blob: any): void => {
                    const fileReader = new FileReader();
                    fileReader.onload = (event: any) => resolve(new Blob([event.target.result]));
                    fileReader.onerror = (event: any) => onError(event.target.error);
                    fileReader.readAsArrayBuffer(blob);
                }, onError);
            const onError = (error: any): void => reject(error);

            window.resolveLocalFileSystemURL(uri, onSuccess, onError);
        });
    }

    function saveDocument(imageObject: mendix.lib.MxObject, uri: string, blob: Blob): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const guid = imageObject.getGuid();
            const filename = /[^/]*$/.exec(uri)![0];
            const onSuccess = (): void => resolve(true);
            const onError = (error: Error): void => reject(error.message);

            mx.data.saveDocument(guid, filename, {}, blob, onSuccess, onError);
        });
    }

    function getOptions(): CameraOptions {
        const size = getPictureSize();

        return {
            targetWidth: size[0],
            targetHeight: size[1],
            quality: 90,
            correctOrientation: true,
            sourceType:
                pictureSource === "camera"
                    ? CordovaCameraPictureSourceType.CAMERA
                    : CordovaCameraPictureSourceType.PHOTOLIBRARY,
            destinationType: CordovaCameraDestinationType.FILE_URI
        };
    }

    function getPictureSize(): [number, number] {
        switch (pictureQuality) {
            case "low":
                return [1024, 1024];
            case "medium":
            default:
                return [2048, 2048];
            case "high":
                return [4096, 4096];
            case "custom":
                return [Number(maximumWidth), Number(maximumHeight)];
        }
    }
    // END USER CODE
}
