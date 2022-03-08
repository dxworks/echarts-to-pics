# echarts-to-pics

Simple command line application in order to transform svg's that are generated with echarts into images of different formats:

To run the command: 

node ./src/generate-images <folder-name> <format> *<image-size> *<options>

All svg's and files will be generated in ./GenerateImages folder
Where: 
- <folder-name> is a mandatory parameter for the folder from where the echarts json(s) are going to be read
- <format> is a mandatory parameter for a specific image format. The accepted formats are: jpg|jpeg|png
- <image_size> is an optional parameter of the actual size of the image, by default is set to 1000
- <options> is used to create the image in a specific way. For more details about the options, check: https://www.npmjs.com/package/svgexport