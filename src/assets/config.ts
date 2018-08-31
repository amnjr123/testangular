export class Config {
    geoServerHost = '10.205.8.226:4601';
    nodeServerHost ='http://10.205.8.226:4605/sqlqry'

    constructor(){

    }

    getGeoServerHost(){
        return this.geoServerHost;
    }
    getNodeServerHost(){
        return this.nodeServerHost;
    }
}