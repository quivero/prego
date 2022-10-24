let animal = 'dog';

export const statusMW = (req, res, next) => {
	res.statusImagePath = "assets/status/"+animal+'/'+res.statusCode+".jpg"
	next();
};

export const statusImgPath = (statusCode) => "assets/status/"+animal+'/'+statusCode+".jpg";


