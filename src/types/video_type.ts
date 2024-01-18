export type S3Response = {
    '$metadata': {
        httpStatusCode: number;
        requestId: string;
        extendedRequestId: string;
        cfId?: undefined;
        attempts: number;
        totalRetryDelay: number;
    };
    ETag: string;
    ServerSideEncryption: string;
    VersionId: string;
    Bucket: string;
    Key: string;
    Location: string;
};

export type S3ErrorResponse = {
    error: boolean;
    msg: any;
}