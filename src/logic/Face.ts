class Face {
    owner: string = '';

    isAvailable() {
        console.log('Face.isAvail: owner=' + this.owner);
        return (this.owner?.length>0)? false:true; 
    }

    setOwner(owner:string) {
        console.log('Face.setOwner: ' + owner);
        this.owner=owner;
    }
}

export default Face;